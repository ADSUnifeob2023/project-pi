import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import dayjs from 'dayjs';

const router = Router();
const prisma = new PrismaClient();

router.get('/', (req: Request, res: Response) => {
    res.render('index',{ error: null,success: null,});
});
router.post('/', async (req: Request, res: Response) => {

   const { name, email, phone, data } = req.body;

   const emailRegex = /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,}(?:\.[a-z]{2,})?$/i;
   const phoneRegex = /^(55)?(?:([1-9]{2})?)(\d{4,5})(\d{4})$/;
   
   if(!name || name.length < 2) {
    return res.status(400).send('O nome deve ter pelo menos 2 caracteres');
   }

   if(emailRegex.test(email) === false) {
    return res.status(400).send('Email inválido');
   }

   if(phoneRegex.test(phone.replace(/\D/g, '')) === false) {
    return res.status(400).send('Telefone inválido');
   }

   if(!data || dayjs(data,'YYYY-MM-DD',true).isValid() === false){
    return res.status(400).send('Data inválida');
   }

   try{

    const EmailExists = await prisma.formData.findFirst({
    where: {
        email: email
    }
});

    if(EmailExists) {
        return res.render('index', {
            error: 'Este e-mail já está cadastrado.',
            success: null
        });
       
    }

    await prisma.formData.create({
        data:{
            name,
            email,
            phone,
            dateBirth: dayjs(data).toDate()
        }
    });

    return res.render('index', {
        success: 'Cadastro realizado com sucesso!',
        error: null,
    });

   }catch(error) {
        console.error('Erro ao processar os dados:', error);
   }

});

export default router;