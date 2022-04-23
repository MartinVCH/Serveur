







const object1 = {
    address: 'allo@gmail.com',
    message: 'bonjour les amis, ceci est un message'
};

for (const [key,value] of Object.entries(object1)){
    console.log(`${key}: ${value}`);
}


