import { TrendingDown, TrendingUp } from "lucide-react";

export interface OrderBookEntry { price: number; quantity: number; total?: number }

export interface MarketplaceOrderBookProps {
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
  midPrice: number;
  symbol: string;
  quoteSymbol?: string;
  currencyDecimals?: number;
  className?: string;
}

export function MarketplaceOrderBook({ bids, asks, midPrice, symbol, quoteSymbol = "SUI", currencyDecimals = 2, className = "" }: MarketplaceOrderBookProps) {
  const maxQuantity = Math.max(1, ...bids.map((item) => item.quantity), ...asks.map((item) => item.quantity));
  return (
    <section className={`panel overflow-hidden p-6 ${className}`} aria-label={`${symbol} order book`}>
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-5"><div><h2 className="font-display text-xl font-bold text-ink">Simulated order book</h2><p className="mt-2 font-mono text-[11px] font-semibold text-teal">{symbol} / {quoteSymbol}</p></div><span className="text-xs text-muted">Testnet market depth</span></div>
      <div className="mt-5 space-y-2">{asks.map((entry) => <OrderRow key={`ask-${entry.price}-${entry.quantity}`} entry={entry} side="sell" width={(entry.quantity / maxQuantity) * 100} decimals={currencyDecimals} />)}</div>
      <div className="my-5 flex items-center justify-between rounded-md bg-navy px-5 py-4 text-white"><span className="font-mono text-[10px] font-semibold text-cyan">MID PRICE</span><span className="font-display text-xl font-bold">{midPrice.toFixed(currencyDecimals)} {quoteSymbol}</span></div>
      <div className="space-y-2">{bids.map((entry) => <OrderRow key={`bid-${entry.price}-${entry.quantity}`} entry={entry} side="buy" width={(entry.quantity / maxQuantity) * 100} decimals={currencyDecimals} />)}</div>
    </section>
  );
}

function OrderRow({ entry, side, width, decimals }: { entry: OrderBookEntry; side: "buy" | "sell"; width: number; decimals: number }) {
  const buy = side === "buy";
  return <div className="relative h-8 overflow-hidden rounded-md"><div className={`absolute inset-y-0 left-0 ${buy ? "bg-leaf/15" : "bg-coral/10"}`} style={{ width: `${Math.max(8, width)}%` }} /><div className="relative flex h-full items-center justify-between px-3 font-mono text-[11px]"><span className={`inline-flex items-center gap-1 font-semibold ${buy ? "text-moss" : "text-coral"}`}>{buy ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}{entry.price.toFixed(decimals)}</span><span className="text-muted">{entry.quantity.toLocaleString()}</span></div></div>;
}
