class GraphsController < ApplicationController

  def index
    # ********** 以下を追加 **********
    gon.chart_label = ['1/1', '1/2', '1/4', '1/5', '1/6', '1/7']
    # null を nil にしないといけないので注意！
    gon.chart_data = [60.3, 61.1, 60.8, nil, 60.5, 61.4]
    # ********** 以上を追加 **********
  end
end
