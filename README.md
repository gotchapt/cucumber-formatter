# cucumber-formatter

## Features

Automatically indent JSON and Graphql steps inside the currently opened `.feature` file.


[GitHub repository](https://github.com/gotchapt/cucumber-formatter)\
[Create an issue](https://github.com/gotchapt/cucumber-formatter/issues/new)\
[Write a review](https://marketplace.visualstudio.com/items?itemName=telmodsg.cucumber-formatter#review-details)

## Disclaimer

This project extends the functionality of stale [cucumber-json-formatter](https://github.com/XavierLeTohic/cucumber-json-formatter) project.

## Usage

1. Open your `.feature` file
2. Open command list: `CMD + Shift + P`
3. Select `Format the current .feature file`

## Examples

Before
```feature
  Scenario: Should format JSON
    Given the following JSON:
      """
{
"hello": "world",
"object":{
"john": "doe"
}
}
      """
```

After
```feature
  Scenario: Should format JSON
    Given the following JSON:
      """
      {
        "hello": "world",
        "object": {
          "john": "doe"
        }
      }
      """
```

Before
```feature
  Scenario: Should format GQL
    Given the following GQL query:
      """
query getPotatoes($id: ID!) {
potatoes(id: $id) {
today {
price
}
}
}
      """
```

After
```feature
  Scenario: Should format GQL
    Given the following GQL query:
      """
      query getPotatoes($id: ID!) {
          potatoes(id: $id) {
              today {
                  price
              }
          }
      }
      """
```

## Release Notes

### 1.0.0

Initial release of `cucumber-formatter`
