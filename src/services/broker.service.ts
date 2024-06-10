import { Catalog } from '../models/catalog.model'
import { ServiceInstanceStateResponse } from '../models/response/service-instance-state-response.model'

export interface BrokerService {
  importCatalog(file: Express.Multer.File): Promise<Catalog>
  getCatalog(): Promise<Catalog>
  provision(
    instanceId: string,
    details: any,
    iamId: string,
    region: string,
  ): Promise<Record<string, any>>
  deprovision(
    instanceId: string,
    planId: string,
    serviceId: string,
    iamId: string,
  ): Promise<Record<string, any>>
  update(
    instanceId: string,
    updateData: any,
    iamId: string,
    region: string,
  ): Promise<Record<string, any>>
  lastOperation(instanceId: string, iamId: string): Promise<Record<string, any>>
  updateState(
    instanceId: string,
    updateData: any,
    iamId: string,
  ): Promise<ServiceInstanceStateResponse>
  getState(instanceId: string, iamId: string): Promise<Record<string, any>>
  bind(
    instanceId: string,
    bindingId: string,
    details: any,
  ): Promise<Record<string, any>>
  unbind(
    instanceId: string,
    bindingId: string,
    planId: string,
    serviceId: string,
  ): Promise<Record<string, any>>
}
