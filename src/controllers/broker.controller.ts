import { NextFunction, Request, Response } from 'express'
import { BrokerService } from '../services/broker.service'
import Logger from '../utils/logger'
import BrokerUtil from '../utils/brokerUtil'
import BadRequestError from '../errors/bad-request-error'

export class BrokerController {
  constructor(private brokerService: BrokerService) {}

  public importCatalog = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const file = req.file
      if (!file) {
        throw new BadRequestError(
          'No file provided. Please upload a catalog file.',
        )
      }
      const result = await this.brokerService.importCatalog(file)
      res.status(200).json(result)
    } catch (error) {
      Logger.error(`Error importing catalog: ${error}`)
      next(error)
    }
  }

  public getCatalog = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const catalog = await this.brokerService.getCatalog()

      Logger.info('Request completed: GET /v2/catalog')

      res.json(catalog)
    } catch (error) {
      Logger.error(`Error retrieving catalog: ${error}`)
      next(error)
    }
  }

  public provision = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const instanceId = req.params.instanceId ?? ''
      const acceptsIncomplete = req.query.accepts_incomplete === 'true'

      Logger.info(
        `Create Service Instance request received: PUT /v2/service_instances/${instanceId}?accepts_incomplete=${acceptsIncomplete} request body: ${JSON.stringify(req.body)}`,
      )

      const iamId = BrokerUtil.getIamId(req) ?? ''
      const bluemixRegion =
        BrokerUtil.getHeaderValue(req, BrokerUtil.BLUEMIX_REGION_HEADER) ?? ''

      if (!instanceId || !iamId || !bluemixRegion) {
        throw new Error(
          'One or more required parameters are missing or invalid.',
        )
      }

      const result = await this.brokerService.provision(
        instanceId,
        req.body,
        iamId,
        bluemixRegion,
      )

      Logger.info(
        `Create Service Instance Response status: 201, body: ${JSON.stringify(result)}`,
      )

      res.status(201).json(result)
    } catch (error) {
      Logger.error(`Error provisioning service instance: ${error}`)
      next(error)
    }
  }

  public updateServiceInstance = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const instanceId = req.params.instanceId
      const originatingIdentity =
        req.header('x-broker-api-originating-identity') ?? ''

      const result = await this.brokerService.updateState(
        instanceId,
        req.body,
        originatingIdentity,
      )
      res.status(200).json(result)
    } catch (error) {
      Logger.error(`Error updating service instance: ${error}`)
      next(error)
    }
  }

  public getState = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const instanceId = req.params.instanceId
      const originatingIdentity =
        req.header('x-broker-api-originating-identity') ?? ''

      const state = await this.brokerService.getState(
        instanceId,
        originatingIdentity,
      )
      res.json(state)
    } catch (error) {
      Logger.error(`Error getting state: ${error}`)
      next(error)
    }
  }

  public bind = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const instanceId = req.params.instanceId
      const bindingId = req.params.bindingId
      const result = await this.brokerService.bind(
        instanceId,
        bindingId,
        req.body,
      )
      res.status(201).json(result)
    } catch (error) {
      Logger.error(`Error binding service: ${error}`)
      next(error)
    }
  }

  public unbind = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const instanceId = req.params.instanceId
      const bindingId = req.params.bindingId
      const result = await this.brokerService.unbind(
        instanceId,
        bindingId,
        req.query.plan_id as string,
        req.query.service_id as string,
      )
      res.status(200).json(result)
    } catch (error) {
      Logger.error(`Error unbinding service: ${error}`)
      next(error)
    }
  }

  public deprovision = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const instanceId = req.params.instanceId
      const acceptsIncomplete = req.query.accepts_incomplete === 'true'
      const planId = req.query.plan_id as string
      const serviceId = req.query.service_id as string

      Logger.info(
        `Deprovision Service Instance request received: DELETE /v2/service_instances/${instanceId}?accepts_incomplete=${acceptsIncomplete}&plan_id=${planId}&service_id=${serviceId}`,
      )

      const result = await this.brokerService.deprovision(
        instanceId,
        planId,
        serviceId,
        BrokerUtil.getIamId(req) ?? '',
      )

      Logger.info(
        `Deprovision Service Instance Response status: 200, body: ${result}`,
      )

      res.status(200).json(result)
    } catch (error) {
      Logger.error(`Error deprovisioning service instance: ${error}`)
      next(error)
    }
  }

  public update = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const instanceId = req.params.instanceId
      const originatingIdentity =
        req.header('x-broker-api-originating-identity') ?? ''
      const bluemixRegion = req.header('x-bluemix-region') ?? ''

      const result = await this.brokerService.update(
        instanceId,
        req.body,
        originatingIdentity,
        bluemixRegion,
      )
      res.status(200).json(result)
    } catch (error) {
      Logger.error(`Error updating service: ${error}`)
      next(error)
    }
  }

  public fetchLastOperation = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const instanceId = req.params.instanceId
      const originatingIdentity =
        req.header('x-broker-api-originating-identity') ?? ''

      const result = await this.brokerService.lastOperation(
        instanceId,
        originatingIdentity,
      )
      res.status(200).json(result)
    } catch (error) {
      Logger.error(`Error fetching last operation: ${error}`)
      next(error)
    }
  }
}
