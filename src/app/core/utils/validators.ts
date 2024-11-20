import { AbstractControl, ValidationErrors } from "@angular/forms";

export function passwordValidator(control:AbstractControl):ValidationErrors|null {
    const passwordRegex = /^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%?&.]{8,}$/
    const valid = passwordRegex.test(control.value)

    return valid ? null : { passworStrength:'La contraseña no cumple con los requisitos' }
}

export function passwordMatchValidator(group:AbstractControl):ValidationErrors|null {
    const password = group.get('password')?.value
    const confirmPassword = group.get('confirmPassword')?.value

    return password === confirmPassword ? null : { passwordMismatch:'Las contraseñas no coinciden' }
}