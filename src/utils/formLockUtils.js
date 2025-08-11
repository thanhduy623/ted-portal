export function lockForm(formSelector = 'form') {
    const form = document.querySelector(formSelector)
    if (!form) return

    form.querySelectorAll('input, select, textarea').forEach(el => {
        if (!el.disabled) {
            el.disabled = true
            el.dataset.locked = "true"
        }
    })
}

export function unlockForm(formSelector = 'form') {
    const form = document.querySelector(formSelector)
    if (!form) return

    form.querySelectorAll('[data-locked="true"]').forEach(el => {
        el.disabled = false
        delete el.dataset.locked
    })
}

export default {
    lockForm,
    unlockForm
}
