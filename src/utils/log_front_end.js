import supabase from "../supabase/createClient.js";

export async function logFEEvent(event_name, value) {
    const {error} = await supabase
        .from('generic_events')
        .insert({
            name: event_name,
            value: value,
            type: 'FRONT_END_EVENT'
        })
    if (error != null)
        return new Error(`Log FE Event Fail ${error.message}`)
}