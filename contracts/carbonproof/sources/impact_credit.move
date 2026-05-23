module carbonproof::impact_credit {

    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;

    public struct ImpactCredit has key, store {

        id: UID,

        credit_id: u64,
        project_id: u64,

        amount: u64,

        owner: address,

        verified: bool,
        retired: bool,

        walrus_blob_id: vector<u8>,

        created_at: u64,
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

            created_at: tx_context::epoch(ctx),
        };

        transfer::public_transfer(
            credit,
            tx_context::sender(ctx)
        );
    }

    public fun verify_credit(
        credit: &mut ImpactCredit
    ) {
        credit.verified = true;
    }

    public fun retire_credit(
        credit: &mut ImpactCredit
    ) {
        credit.retired = true;
    }
}