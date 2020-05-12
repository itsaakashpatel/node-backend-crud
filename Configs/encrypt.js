const bcrypt = require('bcrypt');

class EncryptionHandler {

      /* 
        * Encrypt Entity
        */
       encryptEntity(entity) {
        return bcrypt.hashSync(entity.toString(), bcrypt.genSaltSync(parseInt(process.env.BCRYPT_SALT_ROUNDS)), null);
      }

      /* 
        * Compare Encrypt Entity
        */
       compareEncryptEntity(entity, encryptEntity) {
        return bcrypt.compareSync(entity, encryptEntity);
      }

}

module.exports = EncryptionHandler