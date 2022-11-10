let upstream =
      https://github.com/purescript/package-sets/releases/download/psc-0.15.4-20221108/packages.dhall
        sha256:c7a61f5937f09a2fa5e06c1857aea835645f78856469fdb99ae036a5ba768e41

in  upstream
  with record-studio =
    { repo = "https://github.com/rowtype-yoga/purescript-record-studio.git"
    , version = "v1.0.1"
    , dependencies =
      [ "heterogeneous", "lists", "prelude", "record", "typelevel-prelude" ]
    }
