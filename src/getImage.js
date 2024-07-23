
const baseUrl = "https://xray-backend.codingtier.com"
const GetImage = async (url,STORAGE_TYPE_ID,statusCode,apiKey,TIMESTAMP,NONCE,DIGEST,callback) =>
{
    let image = fetch(`${baseUrl}/xray-eval-3/image?file_url=${url}&storage_type_id=${STORAGE_TYPE_ID}`,{
        method: 'GET',
        // headers: {
        //     "X-API-KEY" : apiKey,
        //     "X-TIMESTAMP" : TIMESTAMP,
        //     "X-NONCE" : NONCE,
        //     "Authentication" : DIGEST,
        // },
        })
    .then(
        function(response) {
            return response.json()
            // callback(response.body);

        }
    )
    .then (  function(data) {
        if(callback)
        {
            callback(data.base64);
        }
        return data.base64
      }
    )
    .catch(function(err) {
        console.log('Fetch Error : ', err);
    });

    return image;
}


const getImageFromObject = async ({imageUrl, STORAGE_TYPE_ID}) => {


    let image = await GetImage(imageUrl,STORAGE_TYPE_ID,200);
    console.log("here",image)
    return image

}

export default getImageFromObject;