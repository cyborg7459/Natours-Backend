import '@babel/polyfill';
import { login } from './login';

const email = document.getElementById('email').value;
const password = document.getElementById('password').value;
const form = document.querySelector('.form');

if(form) {
    form.addEventListener('submit', e=> {
        e.preventDefault();
        login(email, password);
    })
}

