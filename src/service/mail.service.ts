import { Transporter } from "nodemailer"
import * as nodemailer from "nodemailer"
import * as process from "process"

export class MailService {
  public transporter: Transporter
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "smtp.mail.ru",
      port: 465,
      secure: true,
      auth: {
        user: "enshi-ru@mail.ru",
        pass: "xisJwTQsTJBR7fb5rSQt"
      }
    })
  }
  async sendActivationMail(to, link) {
    try {
      await this.transporter.sendMail({
        from: "enshi-ru@mail.ru",
        to,
        subject: "Подтвердите аккаунт на enshi.ru",
        html: `
           <section style="background: #E8EAF0; display: flex; justify-content: center; align-items: center; ">
        <div style="color:black;  background: white; border-radius: 20px; padding:63px 46px;">
         <h1 >Ваш аккаунт <span style="color:#8C53FD;">почти</span> готов</h1>
         <p>Теперь у вас есть Личный кабинет на<br/> нашем сайте. Чтобы активировать его,<br/> нажмите на кнопку ниже.</p>
         <button style=" border:none; width:100%; height:78px; display: flex; justify-content: center; align-items: center; background:#8C53FD; color: white; border-radius: 20px; ">
         <a style="font-size: 1.1rem; font-weight: 600; text-align: center; margin: auto; text-decoration: none; color:white;" href="${
           process.env.DOMAIN + "auth/activate/" + link
         }">Подтвердить</a>
        </button>
        <p style="margin-top:25px; font-size: 1rem; font-weight: 500;">Если нужна помощь, напишите нам во <a href="https://vk.com/enshii" target="_blank" rel="noreferrer">Вконтакте</a></p>
        <p style="margin-top:25px; font-size: 1rem; font-weight: 500;">На связи 24/7<br/>
         C уважением команда ENSHI.</p>
        </div>
       
</section> 
      `
      })
      return
    } catch (e) {
      console.log(e)
    }
  }
  async changePassword(to, passwordLink) {
    try {
      await this.transporter.sendMail({
        from: "enshi-ru@mail.ru",
        to,
        subject: "Получите новый пароль",
        html: `
        <section style="background: #E8EAF0; display: flex; justify-content: center; align-items: center; width:100%;">
        <div style="color:black; max-width:522px;  background: white; border-radius: 20px; padding:63px 46px;">
         <h1 >Ваш новый пароль</h1>
         <button style=" border:none; width:100%; height:78px; display: flex; justify-content: center; align-items: center; background:#8C53FD; border-radius: 20px; ">
         <a  style="font-size: 1.1rem; font-weight: 600; text-align: center; margin: auto; text-decoration: none; color:white;" href="${
           process.env.DOMAIN + "auth/getNewPassword/" + passwordLink
         }">Получить новый пароль</a> 
        </button>
        <p style="margin-top:25px; font-size: 1rem; font-weight: 500;">Если вы считаете, что вы получили это письмо по ошибке, то проигнорируйте его.</p>
        <p style="margin-top:25px; font-size: 1rem; font-weight: 500;">Если нужна помощь, напишите нам во <a href="https://vk.com/enshii" target="_blank" rel="noreferrer">Вконтакте</a></p>
        <p style="margin-top:25px; font-size: 1rem; font-weight: 500;">На связи 24/7<br/>
         C уважением команда ENSHI.</p>
        </div>
       
</section> 
      `
      })
      return
    } catch (e) {
      console.log(e)
    }
  }
}
