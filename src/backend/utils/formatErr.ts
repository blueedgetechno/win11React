import { CAUSE } from '../reducers/fetch/createClient';



const map: Map<CAUSE, string> = new Map<CAUSE, string>()
map.set(CAUSE.UNKNOWN, 'unknown')
map.set(CAUSE.OUT_OF_HARDWARE, 'out_of_hardware')
map.set(CAUSE.MAXIMUM_DEPLOYMENT_REACHED, 'maximum_deployment_reached')
map.set(CAUSE.INVALID_AUTH_HEADER, 'invalid_auth_header')
map.set(CAUSE.API_CALL, 'api_call')
map.set(CAUSE.LOCKED_RESOURCE, 'locked_resource')
map.set(CAUSE.VM_BOOTING_UP, 'vm_booting_up')
map.set(CAUSE.PERMISSION_REQUIRED, 'permission_required')
map.set(CAUSE.NEED_WAIT, 'need_wait')
map.set(CAUSE.INVALID_REQUEST, 'invalid_request')

export function formatError(error: Error) {
    const err = JSON.parse(error.message) as {
        message: string,
        code: CAUSE
    }
    console.log(err)
    return map.get(err.code) ?? err.message
}
