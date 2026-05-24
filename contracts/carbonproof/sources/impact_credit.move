module carbonproof::impact_credit {

    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;

    const E_CREDIT_ALREADY_VERIFIED: u64 = 1;
    const E_CREDIT_ALREADY_RETIRED: u64 = 2;
    const E_CREDIT_NOT_VERIFIED: u64 = 3;

    public struct ImpactCredit has key, store {
        id: UID,

        credit_id: u64,
        project_id: u64,

        amount: u64,

        owner: address,

        verified: bool,
        retired: bool,

        walrus_blob_id: vector<u8>,

        created_epoch: u64,
        verified_epoch: u64,
        retired_epoch: u64,
    }

    public entry fun issue_credit(
        credit_id: u64,
        project_id: u64,
        amount: u64,
        walrus_blob_id: vector<u8>,
        ctx: &mut TxContext
    ) {
        let credit = ImpactCredit {
            id: object::new(ctx),

            credit_id,
            project_id,

            amount,

            owner: tx_context::sender(ctx),

            verified: false,
            retired: false,

            walrus_blob_id,

            created_epoch: tx_context::epoch(ctx),
            verified_epoch: 0,
            retired_epoch: 0,
        };

        transfer::public_transfer(
            credit,
            tx_context::sender(ctx)
        );
    }

    public entry fun verify_credit(
        credit: &mut ImpactCredit,
        ctx: &mut TxContext
    ) {
        assert!(!credit.verified, E_CREDIT_ALREADY_VERIFIED);
        assert!(!credit.retired, E_CREDIT_ALREADY_RETIRED);

        credit.verified = true;
        credit.verified_epoch = tx_context::epoch(ctx);
    }

    public entry fun retire_credit(
        credit: &mut ImpactCredit,
        ctx: &mut TxContext
    ) {
        assert!(credit.verified, E_CREDIT_NOT_VERIFIED);
        assert!(!credit.retired, E_CREDIT_ALREADY_RETIRED);

        credit.retired = true;
        credit.retired_epoch = tx_context::epoch(ctx);
    }

    public fun get_credit_id(
        credit: &ImpactCredit
    ): u64 {
        credit.credit_id
    }

    public fun get_project_id(
        credit: &ImpactCredit
    ): u64 {
        credit.project_id
    }

    public fun get_amount(
        credit: &ImpactCredit
    ): u64 {
        credit.amount
    }

    public fun get_owner(
        credit: &ImpactCredit
    ): address {
        credit.owner
    }

    public fun is_verified(
        credit: &ImpactCredit
    ): bool {
        credit.verified
    }

    public fun is_retired(
        credit: &ImpactCredit
    ): bool {
        credit.retired
    }

    public fun get_walrus_blob_id(
        credit: &ImpactCredit
    ): &vector<u8> {
        &credit.walrus_blob_id
    }

    public fun get_created_epoch(
        credit: &ImpactCredit
    ): u64 {
        credit.created_epoch
    }

    public fun get_verified_epoch(
        credit: &ImpactCredit
    ): u64 {
        credit.verified_epoch
    }

    public fun get_retired_epoch(
        credit: &ImpactCredit
    ): u64 {
        credit.retired_epoch
    }
}