import slides from './slides.md';
import examples from './examples';

let slideshow;

function buildSlideshow() {
  return remark.create({
    ratio: '16:9',
    highlightStyle: 'ocean',
    sourceUrl: slides
  });
}

if (module.hot) {
  module.hot.accept(function() {
    slideshow = buildSlideshow();
  })
}


slideshow = buildSlideshow()

