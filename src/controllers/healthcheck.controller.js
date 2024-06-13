import apiResponse from "../utils/apiResponse.js";

const healthcheck = (req, res) => {
    return res
        .status(200)
        .json(new apiResponse(200, {}, "OK status"));
};

export { healthcheck };
