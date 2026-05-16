export default function decorate(block) {
  const pic = block.querySelector('picture');
  if (!pic) {
    block.classList.add('no-image');
    return;
  }
  block.prepend(pic);
}
