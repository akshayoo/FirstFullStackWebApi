export function toastSet(state, condition, message){

    state({
        condition : condition,
        message : message
    })

    setTimeout(() => {
        state(null)
    }, 2000)
}