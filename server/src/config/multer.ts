import multer from 'multer'; //lida com uploads de imagens
import path from 'path';
import crypto from 'crypto'; //hash aleatorio

export default {
    storage: multer.diskStorage({
        destination: path.resolve(__dirname, '..', '..', 'uploads'), //para onde vai arquivos que foram enviados pelo usuario
        //request: requisicao; file: dados do arquivo; callback: funcao para qunando o filename for processado
        filename: (request, file, callback) => {
            //converter em uma string hexadecimal de 6 caracteres
            const hash = crypto.randomBytes(6).toString('hex');
            //nome do arquivo
            const fileName = `${hash}-${file.originalname}`;

            callback(null, fileName); //null: msg de erro; nome do arquivo
        }
    })
};