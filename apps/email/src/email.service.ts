import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';
import { Options } from 'nodemailer/lib/smtp-transport';

@Injectable()
export class EmailService {
  constructor(
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
  ) {}

  private async setTransport() {
    const OAuth2 = google.auth.OAuth2;
    const oauth2Client = new OAuth2(
      this.configService.get('CLIENT_ID'),
      this.configService.get('CLIENT_SECRET'),
      'https://developers.google.com/oauthplayground',
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.REFRESH_TOKEN,
    });

    const accessToken: string = await new Promise((resolve, reject) => {
      oauth2Client.getAccessToken((err, token) => {
        if (err) {
          reject('Failed to create access token');
        }
        resolve(token);
      });
    });

    const config: Options = {
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: this.configService.get('EMAIL'),
        clientId: this.configService.get('CLIENT_ID'),
        clientSecret: this.configService.get('CLIENT_SECRET'),
        accessToken,
      },
    };

    this.mailerService.addTransporter('gmail', config);
  }

  public async sendMail(data: any) {
    await this.setTransport();
    this.mailerService
      .sendMail({
        transporterName: 'gmail',
        to: 'quocle2208@gmail.com',
        from: 'quocldgcd191316@fpt.edu.vn',
        subject: 'Welcome to Idiea App',
        text: 'Welcome',
        html: `<b>Welcome to IdieaApp</b></br><p>Hi, Let's confirm your email address.</p></br><a>Cofirm Email Address</a>`,
      })
      .then((success) => {
        console.log(success);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async sendMailForNewPost(data: {
    content: string;
    user: {
      _id: string;
      email: string;
      password: string;
      fisrtName: string;
      lastName: string;
      phoneNumber: string;
    };
  }) {
    await this.setTransport();
    this.mailerService
      .sendMail({
        transporterName: 'gmail',
        to: `${data.user.email}`,
        from: 'quocldgcd191316@fpt.edu.vn',
        subject: 'Create Post Sucessfully',
        text: `Congratulations ${data.user.fisrtName} ${data.user.lastName}`,
        html: `<b>Congratulations ${data.user.fisrtName} ${data.user.lastName} Your post now availble in TeamWhale now</b></br><p>Your post post content: ${data.content}</p>`,
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
