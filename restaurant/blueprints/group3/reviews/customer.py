import requests
from flask import request

def get_headers():
    return {"Authorization": request.headers.get("Authorization")}


def get_cid():

    # Sending the get-request with header required
    r = requests.get("http://customer-api:5052/v1/customer/cid", headers=get_headers())
    
    # If the status code is 500, an error on our part occured
    if r.status_code == 500:
        return r.get_json() # Contains "message" and "error" which tell you what happened

    #If the status code is 4xx, there is no logged in customer or the jwt sent is invalid
    elif r.status_code >= 400 and r.status_code< 500:
        return "Not logged in or Invalid authentication"
    
    # The cid from the response is gotten like this
    cid = r.json()["cid"]
    return cid