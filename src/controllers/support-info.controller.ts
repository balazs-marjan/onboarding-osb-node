import { NextFunction, Request, Response } from 'express'
import { SupportInfoService } from '../services/support-info.service'
import Logger from '../utils/logger'

export class SupportInfoController {
  constructor(private readonly supportInfoService: SupportInfoService) {}

  public getInstances = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const instances = await this.supportInfoService.getServiceInstances()
      res.status(200).json(instances)
    } catch (error) {
      Logger.error(`Error retrieving service instances: ${error}`)
      next(error)
    }
  }

  public getMetadata = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const metadata = await this.supportInfoService.getMetadata()
      res.status(200).json(metadata)
    } catch (error) {
      Logger.error(`Error retrieving metadata: ${error}`)
      next(error)
    }
  }
}
