import { TypedEventLog, TypedContractEvent, TypedDeferredTopicFilter } from "../../typechain-types/common";
import { ProofSubmittedEvent, VKRegisteredEvent, ISaturnProofReceiver } from "../../typechain-types/ISaturnProofReceiver";
import { ISaturnVerifier, ProofVerifiedEvent } from "../../typechain-types/ISaturnVerifier";
import * as ethers from "ethers";
export { VKRegisteredEvent, ProofSubmittedEvent, ProofVerifiedEvent };
export type EventData<EventOutput> = {
    blockNumber: number;
    txHash: string;
    event: EventOutput;
};
export type EventSet<EventOutput> = {
    blockNumber: number;
    txHash: string;
    events: EventOutput[];
};
export declare abstract class EventGetter<Event extends TypedContractEvent, EventOutput> {
    saturn: ethers.BaseContract;
    filter: TypedDeferredTopicFilter<Event>;
    constructor(saturn: ethers.BaseContract, filter: TypedDeferredTopicFilter<Event>);
    get(startBlock: number, endBlock: number): Promise<TypedEventLog<Event>[]>;
    getFull(startBlock: number, endBlock: number): Promise<EventData<EventOutput>[]>;
    getFullGroupedByTransaction(startBlock: number, endBlock: number): Promise<EventSet<EventOutput>[]>;
    abstract parseEvent(ev: TypedEventLog<Event>): EventOutput;
}
export declare class ProofSubmittedEventGetter extends EventGetter<ProofSubmittedEvent.Event, ProofSubmittedEvent.OutputObject> {
    constructor(saturn: ISaturnProofReceiver, ...args: Partial<ProofSubmittedEvent.InputTuple>);
    parseEvent(ev: TypedEventLog<ProofSubmittedEvent.Event>): ProofSubmittedEvent.OutputObject;
}
export declare class ProofVerifiedEventGetter extends EventGetter<ProofVerifiedEvent.Event, ProofVerifiedEvent.OutputObject> {
    constructor(saturn: ISaturnVerifier, ...args: Partial<ProofVerifiedEvent.InputTuple>);
    parseEvent(ev: TypedEventLog<ProofVerifiedEvent.Event>): ProofVerifiedEvent.OutputObject;
}
export declare class VKRegisteredEventGetter extends EventGetter<VKRegisteredEvent.Event, VKRegisteredEvent.OutputObject> {
    constructor(saturn: ISaturnProofReceiver);
    parseEvent(ev: TypedEventLog<VKRegisteredEvent.Event>): VKRegisteredEvent.OutputObject;
}
