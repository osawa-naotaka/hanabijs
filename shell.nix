let pkgs = import <nixpkgs> {};

in pkgs.mkShell rec {
  name = "bun-dev";

  buildInputs = with pkgs; [
    bun
  ];
}
