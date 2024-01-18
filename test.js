const bcrypt = require("bcrypt");

const test = async () => {
return console.log(await bcrypt.compare("5500", "$2b$12$eRCz212Il09SwUUngaK7zOfSRnSTm.NJvvswoiZKAnR9TagY6ms9."));
};

test()