let utils = module.exports;

utils.info = function(text){
    console.info(text);
};

utils.error = function(text){
    console.info("ERROR : ",text);
};

utils.promise = function(text){
    return new Promise((resolve, reject)=>{
        console.log('--- Lancement asynchrone');


        setTimeout(()=>{
            resolve("OK");
        },1000);


        reject('NOT OK');

    })
};