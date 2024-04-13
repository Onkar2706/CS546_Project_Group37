// You can add and export any helper functions you want here - if you aren't using any, then you can just leave this file as is

export function validateString(str) {
    return typeof str === 'string' && str.trim() !== '';
 }

 export function validateArray(arr) {
     return Array.isArray(arr) && arr.length > 0 && arr.every(item => validateString(item));
 }

export function validatePrice(price) {
   if(typeof price !== "number" || price < 1 || price === NaN) return false;
   if (!Number.isInteger(price)){
     let parts = price.toString().split(".");
     if(parts[1].length > 2) return false;
   // return true
   }
 
 return true
 }

 export function validateManufacturerWebsite(website) {
     const websiteRegex = /^http:\/\/www\.([a-zA-Z0-9]{5,})\.com$/;
     return (typeof website === 'string' && website.trim().startsWith("http://www.") && website.trim().endsWith(".com") && website.trim().length > 19 && websiteRegex.test(website.trim()))
       
     
       
     
     
 }

 export function validateDate(date) {
     if (!date || typeof date !== 'string') {
         return false;
     }
     let sDate= new Date()
     let userDate = new Date(date) 
    //  const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[1-2][0-9]|3[0-1])\/\d{4}$/;
    //  if (!dateRegex.test(date)) return false;
     const [month, day, year] = date.split('/');
     if(userDate>sDate) return false
     
     const parsedDate = new Date(`${month}/${day}/${year}`);
     return parsedDate && parsedDate.getMonth() == parseInt(month) - 1;
 }

 export function validateObjectId(id){
    
       
        const pattern = /^[0-9a-fA-F]{24}$/; 
        return pattern.test(id); 
    
 }


 export function validateRating(rating){
    if (rating < 1 || rating > 5) {
        throw new Error('Rating should be between 1 and 5');
    }
    return true

 }



 export function avgRating(rating){
    if (rating.length === 0) return 0;
    let result = 0
    for (let index = 0; index < rating.length; index++) {
        const element = rating[index]["rating"];
        result+=element

        
        
    }


    const average = result/rating.length
    let finalAvg = average.toFixed(1);
    finalAvg = parseFloat(finalAvg);

    
    return finalAvg
 }