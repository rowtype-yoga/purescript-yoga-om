{ name = "yoga-appm"
, dependencies =
  [ "aff"
  , "avar"
  , "console"
  , "control"
  , "datetime"
  , "effect"
  , "either"
  , "exceptions"
  , "functions"
  , "maybe"
  , "newtype"
  , "parallel"
  , "prelude"
  , "record"
  , "record-studio"
  , "tailrec"
  , "transformers"
  , "tuples"
  , "typelevel-prelude"
  , "uncurried-transformers"
  , "unsafe-coerce"
  , "variant"
  ]
, packages = ./packages.dhall
, sources = [ "src/**/*.purs" ]
}
