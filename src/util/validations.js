const validatePassword = (setErrors, password, confirmPassword) => {
    if (password === "") {
        setErrors(prev => ({ ...prev, password: "Password is required" }))
        return false;
    } else if (!password.match(/[A-Z]/g)) {
        setErrors(prev => ({ ...prev, password: "Password should contain uppercase letter" }))
        return false;
    } else if (!password.match(/[a-z]/g)) {
        setErrors(prev => ({ ...prev, password: "Password should contain lowercase letter" }))
        return false;
    } else if (!password.match(/[0-9]/g)) {
        setErrors(prev => ({ ...prev, password: "Password should contain digits" }))
        return false;
    } else if (!password.match(/[!@#$%^&*]/g)) {
        setErrors(prev => ({ ...prev, password: "Password should contain special characters" }))
        return false;
    } else if (password.length < 8) {
        setErrors(prev => ({ ...prev, password: "Minimum password length is 8 letter" }))
        return false;
    } else if (password !== "" && confirmPassword === "") {
        setErrors(prev => ({ ...prev, password: "Password and confirm password does not match" }))
        return false;
    } else if (password !== confirmPassword) {
        setErrors(prev => ({ ...prev, password: "Password and confirm password does not match" }))
        return false;
    } else {
        setErrors(prev => ({ ...prev, password: "" }))
        return true;
    }
}

const validateEmail = (setErrors, email) => {
    var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (email === "") {
        setErrors(prev => ({ ...prev, email: "Email is required" }))
        return false;
    } else if (!email.match(validRegex)) {
        setErrors(prev => ({ ...prev, email: "Invalid email" }))
        return false;
    } else {
        setErrors(prev => ({ ...prev, email: "" }))
        return true;
    }
}

const validateUsername = (setErrors, username) => {
    if (username.length < 6) {
        setErrors(prev => ({ ...prev, username: "Username should contain alteast 6 letter" }))
        return false;
    } else {
        setErrors(prev => ({ ...prev, username: "" }))
        return true;
    }
}

const validateImageUrl = (url) => {
    // var pattern = new RegExp('^(https?:\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$', 'i');
    // console.log(!!pattern.test(url))
    // if (!!pattern.test(url)) {
    let image = new Image();
    image.src = url
    image.onload = () => {
        console.log("true")
        return true
    }
    image.onerror = () => {
        return false
    }
    console.log(image.onload)
    return image.onloadeddata;
    // } else {
    // return false
    // }
}

export { validateEmail, validatePassword, validateUsername, validateImageUrl };