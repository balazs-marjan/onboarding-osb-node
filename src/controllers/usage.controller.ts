import { NextFunction, Request, Response } from 'express'
import { UsageService } from '../services/usage.service'
import Logger from '../utils/logger'

export class UsageController {
  constructor(private readonly usageService: UsageService) {}

  public sendUsageData = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const resourceId = req.params.resourceId
    const meteringPayload = req.body

    try {
      const response = await this.usageService.sendUsageData(
        resourceId,
        meteringPayload,
      )
      res.status(200).json(response)
    } catch (error) {
      Logger.error(`Error sending usage data: ${error}`)
      next(error)
    }
  }
}
