import {BadRequestException, Injectable} from '@nestjs/common';
import {EMAIL_SENDER_NAME} from "./email.constants";

@Injectable()
export class EmailService {
    async sendEmail(email: string, subject: string, text: string, html: string) {
        const Mailjet = require('node-mailjet');
        const mailjet = Mailjet.apiConnect(
            process.env.MJ_APIKEY_PUBLIC,
            process.env.MJ_APIKEY_PRIVATE,
        );

        const request = mailjet
            .post('send', { version: 'v3.1' })
            .request({
                Messages: [
                    {
                        From: {
                            Email: process.env.SENDER_EMAIL,
                            Name: EMAIL_SENDER_NAME
                        },
                        To: [
                            {
                                Email: email
                            }
                        ],
                        Subject: subject,
                        TextPart: text,
                        HTMLPart: html
                    }
                ]
            })

        request
            .then((result) => {
                return result.body;
            })
            .catch(() => {
                throw new BadRequestException('Failed to send email');
            })
    }
}
