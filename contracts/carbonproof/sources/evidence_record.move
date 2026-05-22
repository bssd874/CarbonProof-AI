module carbonproof::evidence_record {

    use sui::object;
    use sui::tx_context::TxContext;

    public struct EvidenceRecord has key, store {
        id: UID,

        project_id: u64,

        walrus_blob_id: vector<u8>,
        evidence_hash: vector<u8>,
        evidence_type: vector<u8>,

        ai_score: u64,
        verified: bool,

        uploader: address,
        created_at: u64,
    }

    public fun create_evidence(
        project_id: u64,
        walrus_blob_id: vector<u8>,
        evidence_hash: vector<u8>,
        evidence_type: vector<u8>,
        ai_score: u64,
        ctx: &mut TxContext
    ) {

        let evidence = EvidenceRecord {
            id: object::new(ctx),

            project_id,

            walrus_blob_id,
            evidence_hash,
            evidence_type,

            ai_score,
            verified: false,

            uploader: tx_context::sender(ctx),
            created_at: tx_context::epoch(ctx),
        };

        transfer::public_transfer(
            evidence,
            tx_context::sender(ctx)
        );
    }
}