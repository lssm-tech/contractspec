/**
 * Deal domain - Deal management in CRM pipeline.
 */

export { DealStatusEnum, DealStatusFilterEnum } from './deal.enum';
export {
	CreateDealContract,
	ListDealsContract,
	LoseDealContract,
	MoveDealContract,
	WinDealContract,
} from './deal.operation';
export {
	CreateDealInputModel,
	DealLostPayloadModel,
	DealModel,
	DealMovedPayloadModel,
	DealWonPayloadModel,
	ListDealsInputModel,
	ListDealsOutputModel,
	LoseDealInputModel,
	MoveDealInputModel,
	WinDealInputModel,
} from './deal.schema';
