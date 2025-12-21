/**
 * Deal domain - Deal management in CRM pipeline.
 */

export { DealStatusEnum, DealStatusFilterEnum } from './deal.enum';

export {
  DealModel,
  CreateDealInputModel,
  MoveDealInputModel,
  DealMovedPayloadModel,
  WinDealInputModel,
  DealWonPayloadModel,
  LoseDealInputModel,
  DealLostPayloadModel,
  ListDealsInputModel,
  ListDealsOutputModel,
} from './deal.schema';

export {
  CreateDealContract,
  MoveDealContract,
  WinDealContract,
  LoseDealContract,
  ListDealsContract,
} from './deal.operation';
