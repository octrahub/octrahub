(function () {
  const ticker = document.querySelector("#marketTicker");
  if (!ticker) return;

  const value = ticker.querySelector("strong");
  const source = "https://api.coingecko.com/api/v3/simple/price?ids=octra&vs_currencies=usd&include_24hr_change=true";

  function formatPrice(price) {
    if (!Number.isFinite(price)) return "—";
    if (price >= 1) return `$${price.toFixed(2)}`;
    if (price >= 0.01) return `$${price.toFixed(4)}`;
    return `$${price.toFixed(6)}`;
  }

  function formatChange(change) {
    if (!Number.isFinite(change)) return "";
    const sign = change > 0 ? "+" : "";
    return ` ${sign}${change.toFixed(1)}%`;
  }

  fetch(source, { cache: "no-store" })
    .then((response) => {
      if (!response.ok) throw new Error(`price http ${response.status}`);
      return response.json();
    })
    .then((json) => {
      const data = json && json.octra;
      if (!data) throw new Error("price missing");
      value.textContent = `${formatPrice(data.usd)}${formatChange(data.usd_24h_change)}`;
      ticker.dataset.state = Number(data.usd_24h_change) >= 0 ? "up" : "down";
      ticker.title = "price source: coingecko, same feed used by octrascan";
    })
    .catch(() => {
      value.textContent = "price unavailable";
      ticker.dataset.state = "offline";
    });
})();
