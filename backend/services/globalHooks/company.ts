import { Context } from "moleculer";
import { Errors } from "moleculer";

import MerakiRootCause from "../../@types";

export function setOrganizationIdMeta(
  ctx: Context<MerakiRootCause.IOrganizationId, { orgId: string | undefined }>,
) {
  if (!ctx.params.orgId) {
    throw new Errors.ValidationError("Organization id was not found");
  }
  ctx.meta.orgId = ctx.params.orgId;
}
