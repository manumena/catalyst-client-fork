import { AuthChain, Entity, EntityType } from '@dcl/schemas'
import { RequestOptions, ServerStatus } from 'dcl-catalyst-commons'
import type { Writable } from 'stream'
import { BuildEntityOptions, BuildEntityWithoutFilesOptions } from './ContentClient'
import { DeploymentData, DeploymentPreparationData } from './utils/DeploymentBuilder'

export type AvailableContentResult = Array<{
  cid: string
  available: boolean
}>

export type EntityAuditInfoResponse = {
  localTimestamp: number
  authChain: AuthChain
}

export interface ContentAPI {
  /** Build entities */
  buildEntity({ type, pointers, files, metadata }: BuildEntityOptions): Promise<DeploymentPreparationData>
  buildEntityWithoutNewFiles({
    type,
    pointers,
    hashesByKey,
    metadata
  }: BuildEntityWithoutFilesOptions): Promise<DeploymentPreparationData>

  /** Retrieve / Download */
  fetchEntitiesByPointers(type: EntityType, pointers: string[], options?: RequestOptions): Promise<Entity[]>
  fetchEntitiesByIds(type: EntityType, ids: string[], options?: RequestOptions): Promise<Entity[]>
  fetchEntityById(type: EntityType, id: string, options?: RequestOptions): Promise<Entity>
  fetchAuditInfo(type: EntityType, id: string, options?: RequestOptions): Promise<EntityAuditInfoResponse>
  fetchContentStatus(options?: RequestOptions): Promise<ServerStatus>
  downloadContent(contentHash: string, options?: RequestOptions): Promise<Buffer>
  isContentAvailable(cids: string[], options?: RequestOptions): Promise<AvailableContentResult>

  /**
   * pipeContent only works in Node.js like environments
   */
  pipeContent(contentHash: string, writeTo: Writable, options?: RequestOptions): Promise<Map<string, string>>

  /** Upload */
  deployEntity(deployData: DeploymentData, fix?: boolean, options?: RequestOptions): Promise<number>

  /** Status */
  getContentUrl(): string
}
