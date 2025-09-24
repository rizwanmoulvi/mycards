module virtual_card::CardManager {
    use std::signer;
    use std::vector;
    use 0x1::coin;
    use 0x1::aptos_coin;

    // A simple card resource that stores a vault (Coin<AptosCoin>) and owner
    struct Card has store {
      id: u64,
      owner: address,
      // the module stores the vault (custodial)
      vault: coin::Coin<aptos_coin::AptosCoin>,
    }

    // Registry stored under the module publisher account for simplicity.
    // Not gas-optimal for many cards — for production switch to Table.
    struct Registry has key {
      next_id: u64,
      cards: vector<Card>,
    }

    /// Initialize the registry. Only the module publisher can call this.
    public entry fun init_registry(admin: &signer) {
      let addr = signer::address_of(admin);
      // Only allow the module publisher to init the registry
      assert!(addr == @virtual_card, 1);

      // If the registry already exists, abort.
      assert!(!exists<Registry>(@virtual_card), 2);

      let registry = Registry {
        next_id: 1u64,
        cards: vector::empty<Card>(),
      };
      move_to<Registry>(admin, registry);
    }

    /// Check if registry is initialized
    #[view]
    public fun is_registry_initialized(): bool {
      exists<Registry>(@virtual_card)
    }

    /// Create a new card owned by `owner`. Anyone can create cards.
    public entry fun create_card(caller: &signer, owner: address) acquires Registry {
      // Registry must exist (should be initialized by module publisher)
      assert!(exists<Registry>(@virtual_card), 11);
      let reg_ref = borrow_global_mut<Registry>(@virtual_card);

      let id = reg_ref.next_id;
      reg_ref.next_id = id + 1;

      // Create an empty vault (Coin with value 0)
      let empty_coin = coin::zero<aptos_coin::AptosCoin>();

      let card = Card {
        id,
        owner,
        vault: empty_coin,
      };

      vector::push_back(&mut reg_ref.cards, card);
    }

    /// Deposit APT from the caller's account into the card vault (anyone can deposit to any card)
    public entry fun deposit(caller: &signer, card_id: u64, amount: u64) acquires Registry {
      // withdraw coin from caller
      let deposited: coin::Coin<aptos_coin::AptosCoin> = coin::withdraw<aptos_coin::AptosCoin>(caller, amount);

      // find card and merge into its vault
      let reg_ref = borrow_global_mut<Registry>(@virtual_card);
      let idx = index_of_card(&reg_ref.cards, card_id);
      let card_ref = vector::borrow_mut(&mut reg_ref.cards, idx);

      // merge the deposited coin into the card vault
      coin::merge(&mut card_ref.vault, deposited);
    }

    /// Get balance (raw smallest-unit u64) of the card vault
    #[view]
    public fun get_balance(card_id: u64): u64 acquires Registry {
      assert!(exists<Registry>(@virtual_card), 21);
      let reg_ref = borrow_global<Registry>(@virtual_card);
      let idx = index_of_card_immut(&reg_ref.cards, card_id);
      let card_ref = vector::borrow(&reg_ref.cards, idx);
      coin::value(&card_ref.vault)
    }

    /// Get the next card ID that will be assigned
    #[view]  
    public fun get_next_card_id(): u64 acquires Registry {
      assert!(exists<Registry>(@virtual_card), 22);
      let reg_ref = borrow_global<Registry>(@virtual_card);
      reg_ref.next_id
    }

    /// Get the total number of cards created
    #[view]
    public fun get_total_cards(): u64 acquires Registry {
      assert!(exists<Registry>(@virtual_card), 23);
      let reg_ref = borrow_global<Registry>(@virtual_card);
      vector::length(&reg_ref.cards)
    }

    /// Get card details by ID (returns id, owner, balance)
    #[view]
    public fun get_card_details(card_id: u64): (u64, address, u64) acquires Registry {
      assert!(exists<Registry>(@virtual_card), 24);
      let reg_ref = borrow_global<Registry>(@virtual_card);
      let idx = index_of_card_immut(&reg_ref.cards, card_id);
      let card_ref = vector::borrow(&reg_ref.cards, idx);
      (card_ref.id, card_ref.owner, coin::value(&card_ref.vault))
    }

    /// Get all card IDs (for frontend to iterate through)
    #[view]
    public fun get_all_card_ids(): vector<u64> acquires Registry {
      assert!(exists<Registry>(@virtual_card), 25);
      let reg_ref = borrow_global<Registry>(@virtual_card);
      let cards_length = vector::length(&reg_ref.cards);
      let card_ids = vector::empty<u64>();
      let i = 0;
      
      while (i < cards_length) {
        let card_ref = vector::borrow(&reg_ref.cards, i);
        vector::push_back(&mut card_ids, card_ref.id);
        i = i + 1;
      };
      
      card_ids
    }

    /// Owner-only: withdraw APT from card back to owner's account
    public entry fun withdraw(owner_signer: &signer, card_id: u64, amount: u64) acquires Registry {
      let owner_addr = signer::address_of(owner_signer);
      assert!(exists<Registry>(@virtual_card), 31);
      let reg_ref = borrow_global_mut<Registry>(@virtual_card);
      let idx = index_of_card(&reg_ref.cards, card_id);
      let card_ref = vector::borrow_mut(&mut reg_ref.cards, idx);

      // only owner may withdraw
      assert!(card_ref.owner == owner_addr, 32);

      // extract coin from card vault
      let out_coin: coin::Coin<aptos_coin::AptosCoin> = coin::extract(&mut card_ref.vault, amount);
      // deposit into owner's account (owner must have CoinStore registered)
      coin::deposit<aptos_coin::AptosCoin>(owner_addr, out_coin);
    }

    /// Owner-only: send APT from card to another account
    public entry fun send(owner_signer: &signer, card_id: u64, to: address, amount: u64) acquires Registry {
      let owner_addr = signer::address_of(owner_signer);
      assert!(exists<Registry>(@virtual_card), 41);
      let reg_ref = borrow_global_mut<Registry>(@virtual_card);
      let idx = index_of_card(&reg_ref.cards, card_id);
      let card_ref = vector::borrow_mut(&mut reg_ref.cards, idx);

      // only owner may send
      assert!(card_ref.owner == owner_addr, 42);

      // extract the coin and deposit to recipient address
      let out_coin: coin::Coin<aptos_coin::AptosCoin> = coin::extract(&mut card_ref.vault, amount);
      coin::deposit<aptos_coin::AptosCoin>(to, out_coin);
    }

    // --------------------------
    // Helper functions
    // --------------------------

    // find index of card by id; aborts if not found
    fun index_of_card(cards: &vector<Card>, id: u64): u64 {
      let len = vector::length(cards);
      let i = 0;
      while (i < len) {
        let c_ref = vector::borrow(cards, i);
        if (c_ref.id == id) {
          return i
        };
        i = i + 1;
      };
      abort 100 // card not found
    }

    // immutable variant returning usize-like u64 index
    fun index_of_card_immut(cards: &vector<Card>, id: u64): u64 {
      index_of_card(cards, id)
    }
}