import axios from "axios"

axios.interceptors.request.use(
    config => {
        config.headers["group-code"] = "TYXM"
        config.headers["project-id"] = "Pj9909990006"

        return config
    },
    error => {
        return Promise.reject(error)
    }
)

export default axios
