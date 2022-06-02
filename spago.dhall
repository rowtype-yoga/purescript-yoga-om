{ name = "yoga-appm"
, dependencies =
  [ "aff"
  , "checked-exceptions"
  , "console"
  , "effect"
  , "either"
  , "exceptions"
  , "maybe"
  , "newtype"
  , "prelude"
  , "record"
  , "transformers"
  , "typelevel-prelude"
  , "unsafe-coerce"
  , "variant"
  ]
, packages = ./packages.dhall
, sources = [ "src/**/*.purs", "test/**/*.purs" ]
}
