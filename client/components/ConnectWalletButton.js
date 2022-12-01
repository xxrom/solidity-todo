const ConnectWalletButton = ({ connectWallet }) => (
  <button
    className="h-[5rem] text-2xl font-bold py-3 px-12 bg-yellow-300 rounded-lg mb-10 hover:scale-105 transition duration-500 ease-in-out"
    onClick={connectWallet}
  >
    Connect Wallet
  </button>
);

export default ConnectWalletButton;
