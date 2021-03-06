# ![Barebones](http://jaydenseric.com/shared/barebones-logo.svg)

A barebones framework for getting started on a modern front end. Only the things needed in every responsive project are included; ready to extend as required. A Sassy and streamlined alternative to the [HTML5 Boilerplate](http://html5boilerplate.com).

- Minimalist [Sass](http://sass-lang.com) framework.
- Super efficient font icons workflow.
- Write standard CSS without prefixes thanks to [Autoprefixer](https://github.com/postcss/autoprefixer).
- No opinionated bloat or pre-developed components.
- Easy compilation via [Gulp](http://gulpjs.com), setup purely via [NPM](https://npmjs.com).

## Browser support

[Evergreen browsers](http://stackoverflow.com/a/19060334) and IE9.

## Building

Handled via command-line to generate the icon font, compile Sass to CSS, vendor prefix the CSS, concatenate and minify the JS, etc.

### Setup

1. Ensure [Node.js](https://nodejs.org) is installed.
2. Ensure [Gulp](http://gulpjs.com) is installed: `npm install --global gulp`.
3. In the repo, run `npm install`.

The above are only for building during development and are not server requirements.

### Build

In the repo, run `gulp` for a full build.

After an initial build you can run `gulp watch` for file changes to trigger intelligent rebuilds.

## Working with Sass

Sass in */scss* compiles in order:

1. *_config.scss* — set variables here to ensure availability everywhere.
2. *_utilities.scss* — handy mixins, add more of your own as required.
3. *_animations.scss* — animation keyframes.
4. *_foundation.scss* — a simple [CSS foundation](http://jaydenseric.com/blog/forget-normalize-or-resets-lay-your-own-css-foundation).
5. *main.scss* — utilize all the above.

Don't manually vendor prefix rules; [Autoprefixer](https://github.com/postcss/autoprefixer) parses the compiled CSS and adds the prefixes required to support the [browsers configured](https://github.com/postcss/autoprefixer#browsers) in *gulpfile.js*.

## Working with JS

Scripts in */js/src* are concatenated and minified by Gulp to */js/main.min.js* in order:

1. *polyfills* — Modernizr maintains [a handy guide](https://github.com/Modernizr/Modernizr/wiki/HTML5-Cross-Browser-Polyfills).
2. *lib* — libraries like jQuery.
3. *plugins* — plugins dependant on libraries.
4. *main.js* — utilize all the above.

Avoid adding already minified scripts for better sourcemap assisted debugging.

## How-to guide

### Add fonts

1. In */fonts* add a TTF with the filename convention *[font-family](http://www.w3.org/TR/css-fonts-3/#font-family-prop)-[font-weight](http://www.w3.org/TR/css-fonts-3/#font-weight-prop)-[font-style](http://www.w3.org/TR/css-fonts-3/#font-style-prop).ttf*. It's best to stick to number values for the weight so files order nicely.
2. Run `gulp` (see ***Building Barebones***) to add an `@font-face` declaration with a WOFF Base64 data URI to the generated file *_fonts.scss*.
3. In *_config.scss* make sure there is a font stack set for the `font-family`.
4. Use the new font variation in *main.scss*.

#### Example

After adding *proxima-nova-100-italic.ttf* and running Gulp, in *_config.scss* at the end of the ***Font stacks*** section:

```scss
$proxima-nova: Proxima Nova, $sans-serif;
```

In *main.scss*:

```scss
em {
  font-family: $proxima-nova;
  font-weight: 100;
  font-style: italic;
}
```

### Create & use font icons

1. Add an optimized SVG file named after the icon to */icons*.
2. Run `gulp` (see ***Building Barebones***) to generate the new icon font and Unicode character map in the Sass.
3. In *main.scss* use the `icon($position: before, $icon: false, $styles: true)` mixin to add the new icon wherever you like. Use the SVG filename without the extension for the `$icon` parameter. Easy!

See [*"Fun with Sass & font icons"*](http://jaydenseric.com/blog/fun-with-sass-and-font-icons) to learn more about the mixin.

#### Example

The icon *menu.svg* is included by default. After running `gulp`, in *main.scss*:

```scss
.menu {
  @include icon(before, menu) {
    font-size: 200%;
  }
}
```

### Set z-index layers

`z-index` layers can be named and managed as lists within the config, using the `layer($stack, $name, $base-index: 0)` function. Layer lists stack from bottom to top. The optional `$base-index` parameter can be used to layer stacks of layers.

#### Example

In *_config.scss*:

```scss
$scene-layers: (
  sky,
  mountains,
  person
);
```

In *main.scss*:

```scss
.sky {
  z-index: layer($scene-layers, sky);
}
.mountains {
  z-index: layer($scene-layers, mountains);
}
.person {
  z-index: layer($scene-layers, person);
}
```
