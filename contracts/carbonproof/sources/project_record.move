module carbonproof::project_record {

    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;

    public struct ProjectRecord has key, store {
        id: UID,
        project_id: u64,
        owner: address,
        name: vector<u8>,
        description: vector<u8>,
        walrus_root_blob: vector<u8>,
        created_at: u64,
    }

    public entry fun create_project(
        project_id: u64,
        name: vector<u8>,
        description: vector<u8>,
        walrus_root_blob: vector<u8>,
        ctx: &mut TxContext
    ) {

        let project = ProjectRecord {
            id: object::new(ctx),
            project_id,
            owner: tx_context::sender(ctx),
            name,
            description,
            walrus_root_blob,
            created_at: tx_context::epoch(ctx),
        };

        transfer::public_transfer(project, tx_context::sender(ctx));
    }
}