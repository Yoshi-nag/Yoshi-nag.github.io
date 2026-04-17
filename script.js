let data = JSON.parse(localStorage.getItem("kakeibo")) || [];

function save() {
    localStorage.setItem("kakeibo", JSON.stringify(data));
}

function render() {
    const list = document.getElementById("list");
    list.innerHTML = "";

    let total = 0;

    data.forEach((item, index) => {
        const li = document.createElement("li");

        li.textContent = `${item.date || ""} [${item.category || ""}] ${item.type === "income" ? "+" : "-"}${item.amount}円(${item.memo})`;
        
        const btn = document.createElement("button");
        btn.textContent = "削除";

        btn.onclick = () => {
            data = data.filter(d => d !== item);
            save();
            render();
        };

        li.appendChild(btn);
        list.appendChild(li);

        total += item.type === "income" ? item.amount : -item.amount;
    });

    document.getElementById("total").textContent = "合計: " + total + "円";
}

function addData(){
    const amount = Number(document.getElementById("amount").value);
    const type = document.getElementById("type").value;
    const memo = document.getElementById("memo").value;
    const category = document.getElementById("category").value;

    if (!amount) return;

    data.push({
        amount,
        type,
        memo,
        date: new Date().toLocaleDateString(),
        category
     });

    save();
    render();
    drawChart();
}

let chart;

function drawChart(){
    const ctx = document.getElementById("chart").getContext("2d");

    if (chart) {
        chart.destroy();
    }

    //カテゴリごとに合計
    const categoryTotals = {};

    data.forEach(item => {
        if (item.type === "expense") {
            if (!categoryTotals[item.category]) {
                categoryTotals[item.category] = 0;
            }
            categoryTotals[item.category] += item.amount;
        }
    }
    );

    chart = new Chart(ctx, {
        type: "pie",
        data: {
            labels: Object.keys(categoryTotals),
            datasets: [{
                data: Object.values(categoryTotals)
            }]
        }
    });
}

render();
drawChart();

console.log(data);

