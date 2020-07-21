const fetch = require('node-fetch');
const express = require('express')
const app = express()
const port = process.env.PORT || 80

const NIGHTSCOUT_ENDPOINT_URL = process.env.NIGHTSCOUT_ENDPOINT_URL
if(!NIGHTSCOUT_ENDPOINT_URL) throw new Error("NIGHTSCOUT_ENDPOINT_URL is not set.")

app.post('/ShareWebServices/Services/General/LoginPublisherAccountByName', (req, res) => {
    const FAKE_TOKEN = "satoshiwasblack"
    res.json({ data: FAKE_TOKEN })
    /**
     * 
     * 
     * private func fetchToken(_ callback: @escaping (ShareError?, String?) -> Void) {
        let data = [
            "accountName": username,
            "password": password,
            "applicationId": dexcomApplicationId
        ]

        guard let url = URL(string: shareServer + dexcomLoginPath) else {
            return callback(ShareError.fetchError, nil)
        }

        dexcomPOST(url, JSONData: data as [String : AnyObject]?) { (error, response) in
            if let error = error {
                return callback(.httpError(error), nil)
            }

            guard let   response = response,
                let data = response.data(using: .utf8),
                let decoded = try? JSONSerialization.jsonObject(with: data, options: .allowFragments)
                else {
                    return callback(.loginError(errorCode: "unknown"), nil)
            }

            if let token = decoded as? String {
                // success is a JSON-encoded string containing the token
                callback(nil, token)
            } else {
                // failure is a JSON object containing the error reason
                let errorCode = (decoded as? [String: String])?["Code"] ?? "unknown"
                callback(.loginError(errorCode: errorCode), nil)
            }
        }
    }
     * 
     */
})

/**
 * @typedef {Object} DexcomSGV
 * @property {Number} Value Glucose value in American units (milligramsPerDeciliter)
 * @property {Number} Trend
 * @property {String} WT eg. /Date(1462404576000)/
 */

/**
 * @typedef {Object} DexcomError
 * @property {String} Code eg. {'Code': 'SessionNotValid'}
 */

app.post('/ShareWebServices/Services/Publisher/ReadPublisherLatestGlucoseValues', async (req, res) => {
    const {
        sessionId,
        minutes,
        maxCount
    } = req.query
    
    // const defaultOpts = {
    //     maxCount: 50,
    // }

    const url = `${process.env.NIGHTSCOUT_ENDPOINT_URL}/api/v1/entries/sgv.json?units=mgdl&count=${maxCount}`
    const response = await fetch(url)
    const json = await response.json()

    const sgvs = json.map(nightscoutEntryToDexcomEntry)

    res.json({
        data: sgvs
    })
})

function nightscoutEntryToDexcomEntry(entry) {
    const { sgv, date, direction } = entry
    return {
        Value: sgv,
        Trend: nightscoutTrendToDexcomSlope(direction),
        WT: `/Date(${date})/`
    }
}

const ShareGlucoseSlopeOrdinals = {
    NONE: 0,
    DOUBLE_UP: 1,
    SINGLE_UP: 2,
    UP_45: 3,
    FLAT: 4,
    DOWN_45: 5,
    SINGLE_DOWN: 6,
    DOUBLE_DOWN: 7,
    NOT_COMPUTABLE: 8,
    OUT_OF_RANGE: 9
}

function nightscoutTrendToDexcomSlope(trend) {
    switch(trend) {
    case "DoubleUp":
        return ShareGlucoseSlopeOrdinals.DOUBLE_UP;

    case "SingleUp":
        return ShareGlucoseSlopeOrdinals.SINGLE_UP;

    case "FortyFiveUp":
        return ShareGlucoseSlopeOrdinals.UP_45;

    case "Flat":
        return ShareGlucoseSlopeOrdinals.FLAT;

    case "FortyFiveDown":
        return ShareGlucoseSlopeOrdinals.DOWN_45;

    case "SingleDown":
        return ShareGlucoseSlopeOrdinals.SINGLE_DOWN;

    case "DoubleDown":
        return ShareGlucoseSlopeOrdinals.DOUBLE_DOWN;

    case "NOT COMPUTABLE":
        return ShareGlucoseSlopeOrdinals.NOT_COMPUTABLE;

    case "OUT OF RANGE":
        return ShareGlucoseSlopeOrdinals.OUT_OF_RANGE;

    default:
    case "None":
        return ShareGlucoseSlopeOrdinals.NONE;
    }
}

app.listen(port, () => console.log(`Server listening at http://localhost:${port}`))