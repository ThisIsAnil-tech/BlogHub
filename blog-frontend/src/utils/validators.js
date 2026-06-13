export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export const validatePassword = (password) => {
  return password.length >= 6
}

export const validateUsername = (username) => {
  return username.length >= 3 && username.length <= 30
}

export const validateRequired = (value) => {
  return value.trim().length > 0
}

export const validateUrl = (url) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export const validateSlug = (slug) => {
  const re = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
  return re.test(slug)
}