import { Href, Link } from 'expo-router'
import { openBrowserAsync, WebBrowserPresentationStyle } from 'expo-web-browser'
import { type ComponentProps } from 'react'
type Props = Omit<ComponentProps<typeof Link>, 'href' | 'onPress'> & {
  href: Href & string
  onPress?: () => void
}
const normalizeHref = (value: string) =>
  /^https?:\/\//i.test(value) ? value : `https://${value}`
export function ExternalLink({ href, onPress, ...rest }: Props) {
  const normalizedHref = normalizeHref(href)
  return (
    <Link
      target="_blank"
      {...rest}
      href={normalizedHref}
      onPress={async (event) => {
        onPress?.()
        if (process.env.EXPO_OS !== 'web') {
          // Prevent the default behavior of linking to the default browser on native.
          event.preventDefault()
          // Open the link in an in-app browser.
          await openBrowserAsync(normalizedHref, {
            presentationStyle: WebBrowserPresentationStyle.AUTOMATIC,
          })
        }
      }}
    />
  )
}
