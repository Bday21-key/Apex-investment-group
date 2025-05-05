let token = localStorage.getItem("token");

function showDashboard() {
    document.getElementById("auth").style.display = "none";
    document.getElementById("dashboard").style.display = "block";
    getBalance();
}

function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    fetch("/api/auth/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ username, password })
    }).then(res => res.json())
      .then(data => {
        if (data.token) {
            token = data.token;
            localStorage.setItem("token", token);
            showDashboard();
        } else alert("Login failed");
    });
}

function register() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    fetch("/api/auth/register", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ username, password })
    }).then(res => res.json())
      .then(data => alert("Registered! Now log in."));
}

function getBalance() {
    fetch("/api/account", {
        headers: { Authorization: `Bearer ${token}` }
    }).then(res => res.json())
      .then(data => {
        document.getElementById("balance").innerText = data.balance.toFixed(2);
        const list = document.getElementById("transactions");
        list.innerHTML = "";
        data.transactions.forEach(t => {
            const item = document.createElement("li");
            item.innerText = `${t.type}: $${t.amount} to ${t.to || 'N/A'}`;
            list.appendChild(item);
        });
    });
}

function transfer() {
    const to = document.getElementById("toUser").value;
    const amount = parseFloat(document.getElementById("amount").value);
    fetch("/api/account/transfer", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ to, amount })
    }).then(res => res.json())
      .then(() => getBalance());
}

function logout() {
    localStorage.removeItem("token");
    token = null;
    document.getElementById("auth").style.display = "block";
    document.getElementById("dashboard").style.display = "none";
}

if (token) showDashboard();
