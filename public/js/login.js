const email = document.getElementById('email').value;
const password = document.getElementById('password').value;
const form = document.querySelector('.form');

if(form) {
    form.addEventListener('submit', e=> {
        e.preventDefault();
        login(email, password);
    })
}



const login = async (email,password) => {
    try {
        const res = await axios({
            method: 'POST',
            url: 'http://127.0.0.1:3000/api/v1/users/login',
            data: {
                email,
                password
            }
        });    
        if(res.data.status === 'success') {
            alert('Logged in successfully');
            window.setTimeout(() => {
                location.assign('/');
            }, 1500);
        }
    }
    catch(err) {
        console.log(err);
    }
}